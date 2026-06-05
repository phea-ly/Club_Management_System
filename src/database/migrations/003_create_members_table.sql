CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    status ENUM('active', 'inactive', 'pending', 'suspended') NOT NULL DEFAULT 'active',
    participation_count INT NOT NULL DEFAULT 0,
    last_participated_at DATETIME NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_member_club_email (club_id, email),
    KEY idx_members_club_id (club_id),
    KEY idx_members_status (status)
);
