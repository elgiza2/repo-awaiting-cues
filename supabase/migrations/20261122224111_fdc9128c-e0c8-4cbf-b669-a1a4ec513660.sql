CREATE TABLE public.gemston_players (
 telegram_id bigint PRIMARY KEY CHECK (telegram_id > 0),
 first_name text NOT NULL DEFAULT '',
 referrer_id bigint REFERENCES public.gemston_players(telegram_id),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK (referrer_id IS NULL OR referrer_id <> telegram_id)
);
GRANT ALL ON public.gemston_players TO service_role;
ALTER TABLE public.gemston_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY gemston_players_service ON public.gemston_players FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX gemston_players_referrer ON public.gemston_players(referrer_id);

CREATE TABLE public.gemston_verified_withdrawals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 telegram_id bigint NOT NULL REFERENCES public.gemston_players(telegram_id),
 transaction_hash text NOT NULL UNIQUE CHECK (transaction_hash ~ '^[a-fA-F0-9]{64}$'),
 currency text NOT NULL CHECK (currency IN ('GEMSTON','GRAM')),
 amount numeric NOT NULL CHECK (amount > 0),
 destination text NOT NULL,
 verified_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.gemston_verified_withdrawals TO service_role;
ALTER TABLE public.gemston_verified_withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY gemston_withdrawals_read_service ON public.gemston_verified_withdrawals FOR SELECT TO service_role USING (true);
CREATE POLICY gemston_withdrawals_insert_service ON public.gemston_verified_withdrawals FOR INSERT TO service_role WITH CHECK (true);
CREATE INDEX gemston_withdrawals_player ON public.gemston_verified_withdrawals(telegram_id);

CREATE TABLE public.gemston_referral_rewards (
 invitee_id bigint PRIMARY KEY REFERENCES public.gemston_players(telegram_id),
 inviter_id bigint NOT NULL REFERENCES public.gemston_players(telegram_id),
 withdrawal_id uuid NOT NULL UNIQUE REFERENCES public.gemston_verified_withdrawals(id),
 reward_usd numeric NOT NULL DEFAULT 4 CHECK (reward_usd = 4),
 gemston_amount numeric,
 coin_price_usd numeric,
 credited_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK (inviter_id <> invitee_id),
 CHECK ((gemston_amount IS NULL AND coin_price_usd IS NULL AND credited_at IS NULL) OR (gemston_amount >= 0 AND coin_price_usd > 0 AND credited_at IS NOT NULL))
);
GRANT ALL ON public.gemston_referral_rewards TO service_role;
ALTER TABLE public.gemston_referral_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY gemston_rewards_service ON public.gemston_referral_rewards FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX gemston_rewards_inviter ON public.gemston_referral_rewards(inviter_id);

CREATE FUNCTION public.gemston_touch() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER gemston_players_touch BEFORE UPDATE ON public.gemston_players FOR EACH ROW EXECUTE FUNCTION public.gemston_touch();
CREATE TRIGGER gemston_rewards_touch BEFORE UPDATE ON public.gemston_referral_rewards FOR EACH ROW EXECUTE FUNCTION public.gemston_touch();

CREATE FUNCTION public.gemston_lock_referrer() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN IF NEW.referrer_id IS DISTINCT FROM OLD.referrer_id THEN RAISE EXCEPTION 'Referrer cannot be changed'; END IF; RETURN NEW; END $$;
CREATE TRIGGER gemston_referrer_immutable BEFORE UPDATE ON public.gemston_players FOR EACH ROW EXECUTE FUNCTION public.gemston_lock_referrer();

CREATE FUNCTION public.gemston_register(p_id bigint, p_first text, p_referrer bigint DEFAULT NULL) RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_ref bigint;
BEGIN
 IF p_id <= 0 OR p_id > 9007199254740991 THEN RAISE EXCEPTION 'Invalid Telegram identity'; END IF;
 IF p_referrer IS NOT NULL AND p_referrer <> p_id THEN
  SELECT telegram_id INTO v_ref FROM public.gemston_players WHERE telegram_id = p_referrer;
 END IF;
 INSERT INTO public.gemston_players(telegram_id,first_name,referrer_id) VALUES(p_id,left(coalesce(p_first,''),256),v_ref)
 ON CONFLICT (telegram_id) DO UPDATE SET first_name = EXCLUDED.first_name;
END $$;
REVOKE ALL ON FUNCTION public.gemston_register(bigint,text,bigint) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gemston_register(bigint,text,bigint) TO service_role;

CREATE FUNCTION public.gemston_qualify_referral() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_inviter bigint;
BEGIN
 SELECT referrer_id INTO v_inviter FROM public.gemston_players WHERE telegram_id = NEW.telegram_id;
 IF v_inviter IS NOT NULL THEN
  INSERT INTO public.gemston_referral_rewards(invitee_id,inviter_id,withdrawal_id,reward_usd)
  VALUES(NEW.telegram_id,v_inviter,NEW.id,4) ON CONFLICT(invitee_id) DO NOTHING;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER gemston_withdrawal_qualifies AFTER INSERT ON public.gemston_verified_withdrawals FOR EACH ROW EXECUTE FUNCTION public.gemston_qualify_referral();

CREATE FUNCTION public.gemston_referral_summary(p_id bigint, p_coin_price numeric DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_result jsonb;
BEGIN
 IF p_coin_price IS NOT NULL AND p_coin_price > 0 THEN
  UPDATE public.gemston_referral_rewards SET gemston_amount = trunc(reward_usd / p_coin_price,4), coin_price_usd = p_coin_price, credited_at = now()
  WHERE inviter_id = p_id AND credited_at IS NULL;
 END IF;
 SELECT jsonb_build_object(
  'userId',p_id,
  'total',(SELECT count(*) FROM public.gemston_players WHERE referrer_id=p_id),
  'qualified',(SELECT count(*) FROM public.gemston_referral_rewards WHERE inviter_id=p_id),
  'pending',(SELECT count(*) FROM public.gemston_players p WHERE p.referrer_id=p_id AND NOT EXISTS(SELECT 1 FROM public.gemston_referral_rewards r WHERE r.invitee_id=p.telegram_id)),
  'earnedCoins',coalesce((SELECT sum(gemston_amount) FROM public.gemston_referral_rewards WHERE inviter_id=p_id),0),
  'awaitingPriceUsd',coalesce((SELECT sum(reward_usd) FROM public.gemston_referral_rewards WHERE inviter_id=p_id AND credited_at IS NULL),0),
  'friends',coalesce((SELECT jsonb_agg(f) FROM (
   SELECT p.first_name AS name, p.created_at AS "joinedAt", EXISTS(SELECT 1 FROM public.gemston_referral_rewards r WHERE r.invitee_id=p.telegram_id) AS qualified
   FROM public.gemston_players p WHERE p.referrer_id=p_id ORDER BY p.created_at DESC LIMIT 50
  ) f),'[]'::jsonb)
 ) INTO v_result;
 RETURN v_result;
END $$;
REVOKE ALL ON FUNCTION public.gemston_referral_summary(bigint,numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gemston_referral_summary(bigint,numeric) TO service_role;
REVOKE ALL ON FUNCTION public.gemston_touch(), public.gemston_lock_referrer(), public.gemston_qualify_referral() FROM PUBLIC, anon, authenticated;