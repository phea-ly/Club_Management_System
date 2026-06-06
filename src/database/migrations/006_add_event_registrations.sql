SET @registrations_exists := (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'events'
      AND column_name = 'registrations'
);

SET @sql := IF(
    @registrations_exists = 0,
    'ALTER TABLE events ADD COLUMN registrations LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(registrations)) AFTER attendee_count',
    'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE events
SET registrations = JSON_ARRAY()
WHERE registrations IS NULL OR registrations = '';
