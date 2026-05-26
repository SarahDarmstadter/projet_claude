INSERT INTO types (nom) VALUES
    ('Peinture à l''huile'),
    ('Aquarelle'),
    ('Pastel')
ON CONFLICT DO NOTHING;
