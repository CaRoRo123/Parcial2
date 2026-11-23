-- Repara la base legado que mantiene "user"/role (IDs enteros), mientras
-- conserva las tablas users/roles UUID ya creadas por un arranque previo.
BEGIN;

ALTER TABLE user_roles RENAME TO user_roles_legacy;

INSERT INTO users (email, password, name, phone, is_active, created_at)
SELECT email, password, name, phone, lower(is_active) IN ('true', 't', '1', 'yes') AS is_active, created_at FROM "user"
ON CONFLICT (email) DO NOTHING;

INSERT INTO roles (role_name, description, created_at)
SELECT role_name, description, created_at FROM role
ON CONFLICT (role_name) DO NOTHING;

CREATE TEMP TABLE user_id_map ON COMMIT DROP AS
SELECT old.id AS old_id, current.id AS new_id
FROM "user" old JOIN users current ON current.email = old.email;

CREATE TEMP TABLE role_id_map ON COMMIT DROP AS
SELECT old.id AS old_id, current.id AS new_id
FROM role old JOIN roles current ON current.role_name = old.role_name;

CREATE TABLE user_roles (
  "usersId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "rolesId" UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY ("usersId", "rolesId")
);

INSERT INTO user_roles ("usersId", "rolesId")
SELECT um.new_id, rm.new_id
FROM user_roles_legacy ur
JOIN user_id_map um ON um.old_id = ur."userId"
JOIN role_id_map rm ON rm.old_id = ur."roleId"
ON CONFLICT DO NOTHING;

DROP TABLE user_roles_legacy;
DROP TABLE "user";
DROP TABLE role;

COMMIT;

