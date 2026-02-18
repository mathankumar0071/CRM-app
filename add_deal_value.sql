-- Add deal_value column to leads table if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'leads' and column_name = 'deal_value') then
    alter table leads add column deal_value numeric;
  end if;
end $$;
