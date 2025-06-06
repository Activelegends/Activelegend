-- Enable realtime for the favorites table
ALTER PUBLICATION supabase_realtime ADD TABLE favorites;

-- Enable row level security for realtime
ALTER TABLE favorites REPLICA IDENTITY FULL; 