INSERT INTO site_texts (cle, valeur) VALUES ('site.artiste.photo', '')
ON CONFLICT (cle) DO NOTHING;
