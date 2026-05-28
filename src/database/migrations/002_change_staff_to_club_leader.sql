ALTER TABLE users
MODIFY role ENUM('admin', 'member', 'staff', 'club_leader') NOT NULL DEFAULT 'member';

UPDATE users
SET role = 'club_leader'
WHERE role = 'staff';

ALTER TABLE users
MODIFY role ENUM('admin', 'member', 'club_leader') NOT NULL DEFAULT 'member';
