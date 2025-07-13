-- ایجاد جدول download_links برای مدیریت لینک‌های دانلود توسط ادمین
create table if not exists download_links (
  id text primary key,
  url text not null,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ایندکس برای جستجو سریع‌تر
create index if not exists idx_download_links_id on download_links(id); 