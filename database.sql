-- Create database if not exists
CREATE DATABASE IF NOT EXISTS gazeta_universitare 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE gazeta_universitare;

-- Drop table if exists and create new
DROP TABLE IF EXISTS lajme;
DROP TABLE IF EXISTS kontakte;

-- Create news table
CREATE TABLE lajme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(500),
    category ENUM('lajm', 'aktivitet', 'studente', 'horoskop') DEFAULT 'lajm',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO lajme (title, content, image, category, created_at) VALUES
('Workshop i Ri për Zhvillimin e Software', 'Fakulteti organizon workshop të ri për studentët e interesuar në zhvillimin e software-it modern. Pjesëmarrësit do të mësojnë teknologjitë më të fundit në fushën e programimit.', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0d47a1;stop-opacity:1"/><stop offset="100%" style="stop-color:#1565c0;stop-opacity:1"/></linearGradient></defs><rect fill="url(#grad1)" width="600" height="400"/><text x="300" y="200" text-anchor="middle" fill="white" font-size="36" font-weight="bold">Workshop</text></svg>', 'lajm', NOW()),

('Kërkime të Reja në Biologji', 'Studentët tanë prezantojnë kërkime inovative në fushën e biologjisë molekulare që kontribuojnë në zhvillimin e shkencës.', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#006064;stop-opacity:1"/><stop offset="100%" style="stop-color:#00838f;stop-opacity:1"/></linearGradient></defs><rect fill="url(#grad2)" width="600" height="400"/><text x="300" y="200" text-anchor="middle" fill="white" font-size="36" font-weight="bold">Kërkim Shkencor</text></svg>', 'lajm', DATE_SUB(NOW(), INTERVAL 1 DAY)),

('Konferenca Ndërkombëtare e Teknologjisë', 'FSHTN pret konferencën ndërkombëtare për teknologjitë e reja në arsim me pjesëmarrës nga e gjithë bota.', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a237e;stop-opacity:1"/><stop offset="100%" style="stop-color:#283593;stop-opacity:1"/></linearGradient></defs><rect fill="url(#grad3)" width="600" height="400"/><text x="300" y="200" text-anchor="middle" fill="white" font-size="36" font-weight="bold">Konferencë</text></svg>', 'aktivitet', DATE_SUB(NOW(), INTERVAL 2 DAY)),

('Startup Weekend për Studentët', 'Organizohet një event 48-orësh ku studentët mund të krijojnë startups teknologjike dhe të garojnë për çmime.', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e65100;stop-opacity:1"/><stop offset="100%" style="stop-color:#f57c00;stop-opacity:1"/></linearGradient></defs><rect fill="url(#grad4)" width="600" height="400"/><text x="300" y="200" text-anchor="middle" fill="white" font-size="36" font-weight="bold">Startup</text></svg>', 'aktivitet', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Create contacts table (optional)
CREATE TABLE kontakte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emri VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subjekti VARCHAR(200) NOT NULL,
    mesazhi TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create admin user table (optional for future)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (optional)
INSERT INTO admin_users (username, password) VALUES ('admin', MD5('admin123'));

ALTER TABLE lajme MODIFY COLUMN category ENUM('lajm', 'aktivitet', 'horoskop', 'studente') DEFAULT 'lajm';

CREATE TABLE IF NOT EXISTS gjegjeza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pyetja TEXT NOT NULL,
    pergjigjja VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO gjegjeza (pyetja, pergjigjja) VALUES 
('Kam brinjë por nuk kam mish. Çfarë jam?', 'Gjeometria');