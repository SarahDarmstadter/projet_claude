CREATE TABLE site_texts (
    cle     VARCHAR(100) PRIMARY KEY,
    valeur  TEXT NOT NULL
);

INSERT INTO site_texts (cle, valeur) VALUES
  ('site.artiste.nom',          'Pierre Darmstadter'),
  ('site.tagline',              'Peintures contemporaines — Paris'),

  ('accueil.hero.eyebrow',      'Peinture contemporaine · Paris'),
  ('accueil.hero.tagline',      '« La lumière ne se montre jamais deux fois de la même façon. »'),
  ('accueil.hero.cta',          'Découvrir les œuvres'),
  ('accueil.about.eyebrow',     'L''artiste'),
  ('accueil.about.texte',       'Peintre depuis plusieurs décennies, Pierre Darmstadter explore la lumière et la matière dans ses toiles. Son travail, ancré dans la tradition figurative, dialogue avec une sensibilité contemporaine.'),
  ('accueil.about.cta',         'Lire la biographie'),
  ('accueil.galerie.titre',     'Dernières œuvres'),
  ('accueil.galerie.lien',      'Voir toute la galerie →'),

  ('artiste.eyebrow',           'Biographie'),
  ('artiste.photo.legende',     'Pierre Darmstadter, atelier'),
  ('artiste.intro',             'Peintre français, Pierre Darmstadter vit et travaille à Paris. Son œuvre s''inscrit dans une recherche picturale sur la lumière, le temps et la présence des choses.'),
  ('artiste.parcours.titre',    'Parcours'),
  ('artiste.parcours.p1',       'Pierre Darmstadter développe une œuvre singulière, ancrée dans la tradition de la peinture à l''huile mais traversée par une sensibilité contemporaine.'),
  ('artiste.parcours.p2',       'Son travail interroge la lumière dans ses manifestations les plus fugaces : l''aurore sur l''eau, la pénombre d''un intérieur, le dernier éclat du jour avant la nuit.'),

  ('galerie.titre',             'Galerie'),
  ('galerie.sous_titre',        'Œuvres de Pierre Darmstadter'),

  ('contact.eyebrow',           'Contact'),
  ('contact.titre',             'Entrons en conversation'),
  ('contact.description',       'Pour toute demande concernant une œuvre ou une exposition, Pierre Darmstadter vous répondra dans les meilleurs délais.'),
  ('contact.email',             'pierre.darmstadter@gmail.com'),
  ('contact.atelier.lieu',      'Paris'),
  ('contact.atelier.horaires',  'Sur rendez-vous');
