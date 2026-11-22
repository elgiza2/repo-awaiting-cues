-- Run through the migration tool. All test rows are rolled back by the inner subtransaction.
DO $$
DECLARE summary jsonb; receipt uuid; rejected boolean := false;
BEGIN
  BEGIN
    IF EXISTS(SELECT 1 FROM public.gemston_players WHERE telegram_id BETWEEN 8999999999999000 AND 8999999999999004) THEN
      RAISE EXCEPTION 'Test identities already exist';
    END IF;
    PERFORM public.gemston_register(8999999999999000, 'Referral test inviter', NULL);
    PERFORM public.gemston_register(8999999999999001, 'Referral test friend', 8999999999999000);
    PERFORM public.gemston_register(8999999999999001, 'Referral test friend', 8999999999999000);
    summary := public.gemston_referral_summary(8999999999999000, 0.5);
    IF (summary->>'total')::int <> 1 OR (summary->>'pending')::int <> 1 OR (summary->>'qualified')::int <> 0 OR (summary->>'earnedCoins')::numeric <> 0 THEN
      RAISE EXCEPTION 'Registration must be pending and duplicate-safe';
    END IF;
    PERFORM public.gemston_register(8999999999999002, 'Self referral test', 8999999999999002);
    IF (SELECT referrer_id FROM public.gemston_players WHERE telegram_id=8999999999999002) IS NOT NULL THEN RAISE EXCEPTION 'Self referral accepted'; END IF;
    PERFORM public.gemston_register(8999999999999001, 'Rebind test', 8999999999999002);
    IF (SELECT referrer_id FROM public.gemston_players WHERE telegram_id=8999999999999001) <> 8999999999999000 THEN RAISE EXCEPTION 'Referral rebound'; END IF;
    PERFORM public.gemston_register(8999999999999002, 'Existing user test', 8999999999999000);
    IF (SELECT referrer_id FROM public.gemston_players WHERE telegram_id=8999999999999002) IS NOT NULL THEN RAISE EXCEPTION 'Existing user acquired referrer'; END IF;
    BEGIN
      UPDATE public.gemston_players SET referrer_id=8999999999999002 WHERE telegram_id=8999999999999001;
    EXCEPTION WHEN OTHERS THEN rejected := true;
    END;
    IF NOT rejected THEN RAISE EXCEPTION 'Immutable referrer trigger failed'; END IF;
    INSERT INTO public.gemston_verified_withdrawals(telegram_id,transaction_hash,currency,amount,destination,verified_at)
    VALUES(8999999999999001,repeat('a',64),'GEMSTON',1,'test-only-destination',now()) RETURNING id INTO receipt;
    summary := public.gemston_referral_summary(8999999999999000,0.5);
    IF (summary->>'qualified')::int <> 1 OR (summary->>'pending')::int <> 0 OR (summary->>'earnedCoins')::numeric <> 8 THEN RAISE EXCEPTION 'First confirmed withdrawal must credit $4 / $0.5 = 8 GEMSTON'; END IF;
    IF (SELECT reward_usd FROM public.gemston_referral_rewards WHERE withdrawal_id=receipt) <> 4 THEN RAISE EXCEPTION 'Referral must pay $4'; END IF;
    INSERT INTO public.gemston_verified_withdrawals(telegram_id,transaction_hash,currency,amount,destination,verified_at)
    VALUES(8999999999999001,repeat('b',64),'GRAM',0.1,'test-only-destination',now());
    summary := public.gemston_referral_summary(8999999999999000,1);
    IF (summary->>'qualified')::int <> 1 OR (summary->>'earnedCoins')::numeric <> 8 THEN RAISE EXCEPTION 'Repeat withdrawal or price change credited twice'; END IF;
    PERFORM public.gemston_register(8999999999999003,'Second friend',8999999999999000);
    PERFORM public.gemston_register(8999999999999004,'Third friend',8999999999999000);
    INSERT INTO public.gemston_verified_withdrawals(telegram_id,transaction_hash,currency,amount,destination,verified_at)
    VALUES(8999999999999003,repeat('c',64),'GRAM',0.1,'test-only-destination',now()),(8999999999999004,repeat('d',64),'GRAM',0.1,'test-only-destination',now());
    summary := public.gemston_referral_summary(8999999999999000,1);
    IF (summary->>'qualified')::int <> 3 THEN RAISE EXCEPTION 'All three withdrawn friends must qualify'; END IF;
    IF has_table_privilege('anon','public.gemston_players','SELECT') OR has_table_privilege('authenticated','public.gemston_players','SELECT') OR has_table_privilege('anon','public.gemston_verified_withdrawals','INSERT') OR has_table_privilege('authenticated','public.gemston_verified_withdrawals','INSERT') THEN RAISE EXCEPTION 'Private data or withdrawal proof exposed to browsers'; END IF;
    IF has_function_privilege('anon','public.gemston_register(bigint,text,bigint)','EXECUTE') OR has_function_privilege('authenticated','public.gemston_referral_summary(bigint,numeric)','EXECUTE') THEN RAISE EXCEPTION 'Private referral functions exposed'; END IF;
    RAISE EXCEPTION USING ERRCODE='ZT001', MESSAGE='Tests passed; roll back test rows';
  EXCEPTION WHEN SQLSTATE 'ZT001' THEN
    RAISE NOTICE 'Referral database tests passed; no test rows retained';
  END;
END $$;