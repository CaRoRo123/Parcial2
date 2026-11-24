-- Esquema PostgreSQL alineado con las entidades TypeORM y el enunciado.
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR NOT NULL UNIQUE,
  description VARCHAR NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  "usersId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "rolesId" UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY ("usersId", "rolesId")
);

INSERT INTO roles (role_name, description) VALUES
  ('admin', 'Administrador total del sistema'),
  ('supervisor', 'Rol de supervision')
ON CONFLICT (role_name) DO NOTHING;

-- Cuentas de prueba:
-- admin@uniandes.edu.co y user@uniandes.edu.co; ambas usan Admin123456!.
-- El valor guardado es un hash scrypt generado por @nestjs/authentication.
INSERT INTO users (email, password, name, phone, is_active) VALUES
  ('admin@uniandes.edu.co', '$scrypt$ln=17,r=8,p=1$H6G5QfW7pkm7GNtenoqX4g$I9MxRaYCCsz1VNHxcClZF9JgqknifDRMQ6qKscvZpWTwKUPkm6M3SaYdry2YDEeoW0e2y7oRxjxG6pfcaYOndw', 'Usuario Admin', '3001112233', true),
  ('user@uniandes.edu.co', '$scrypt$ln=17,r=8,p=1$H6G5QfW7pkm7GNtenoqX4g$I9MxRaYCCsz1VNHxcClZF9JgqknifDRMQ6qKscvZpWTwKUPkm6M3SaYdry2YDEeoW0e2y7oRxjxG6pfcaYOndw', 'Usuario Normal', '3004445566', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles ("usersId", "rolesId")
SELECT u.id, r.id FROM users u CROSS JOIN roles r
WHERE u.email = 'admin@uniandes.edu.co' AND r.role_name = 'admin'
ON CONFLICT DO NOTHING;
