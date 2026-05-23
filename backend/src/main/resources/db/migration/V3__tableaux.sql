CREATE TABLE types (
    id         BIGSERIAL PRIMARY KEY,
    nom        VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE tableaux (
    id          BIGSERIAL    PRIMARY KEY,
    image_path  VARCHAR(255) NOT NULL,
    titre       VARCHAR(255) NOT NULL,
    largeur     NUMERIC(7,2) NOT NULL,
    hauteur     NUMERIC(7,2) NOT NULL,
    type_id     BIGINT       REFERENCES types(id),
    periode     VARCHAR(50)  NOT NULL,
    prix        NUMERIC(10,2),
    description TEXT,
    statut      VARCHAR(20)  NOT NULL DEFAULT 'disponible'
                             CHECK (statut IN ('disponible','vendu','non_a_vendre')),
    visible     BOOLEAN      NOT NULL DEFAULT TRUE,
    ordre       INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tableaux_visible_ordre ON tableaux (visible, ordre);
CREATE INDEX idx_tableaux_type_id       ON tableaux (type_id);
