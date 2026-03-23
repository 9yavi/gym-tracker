CREATE TABLE gym_tracker. users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    join_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE gym_tracker. branches (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    open_time TIME,
    close_time TIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gym_tracker. memberships (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    branch_id INT NOT NULL,
    membership_type ENUM('monthly', 'quarterly', 'yearly') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('active', 'expired', 'cancelled', 'paused') NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_membership_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_membership_branch
        FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
        ON DELETE CASCADE
);

CREATE TABLE gym_tracker. sports (
    sport_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gym_tracker. branch_sports (
    branch_id INT NOT NULL,
    sport_id INT NOT NULL,
    added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (branch_id, sport_id),
    CONSTRAINT fk_branchsports_branch
        FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_branchsports_sport
        FOREIGN KEY (sport_id) REFERENCES sports(sport_id)
        ON DELETE CASCADE
);

CREATE TABLE gym_tracker. membership_sports (
    membership_id INT NOT NULL,
    sport_id INT NOT NULL,
    enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    enrollment_status ENUM('active', 'paused', 'completed', 'dropped') NOT NULL DEFAULT 'active',
    PRIMARY KEY (membership_id, sport_id),
    CONSTRAINT fk_membershipsports_membership
        FOREIGN KEY (membership_id) REFERENCES memberships(membership_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_membershipsports_sport
        FOREIGN KEY (sport_id) REFERENCES sports(sport_id)
        ON DELETE CASCADE
);

CREATE TABLE gym_tracker. workouts (
    workout_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_id INT NOT NULL,
    workout_name VARCHAR(100) NOT NULL,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    estimated_duration_minutes INT,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workout_sport
        FOREIGN KEY (sport_id) REFERENCES sports(sport_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_workout_duration
        CHECK (estimated_duration_minutes IS NULL OR estimated_duration_minutes > 0)
);

CREATE TABLE gym_tracker. workout_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    membership_id INT NOT NULL,
    workout_id INT NOT NULL,
    log_date DATE NOT NULL,
    duration_minutes INT NOT NULL,
    calories_burned INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_membership
        FOREIGN KEY (membership_id) REFERENCES memberships(membership_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_log_workout
        FOREIGN KEY (workout_id) REFERENCES workouts(workout_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_log_duration
        CHECK (duration_minutes > 0),
    CONSTRAINT chk_log_calories
        CHECK (calories_burned >= 0)
);

CREATE TABLE gym_tracker. streaks (
    streak_id INT AUTO_INCREMENT PRIMARY KEY,
    membership_id INT NOT NULL,
    sport_id INT NOT NULL,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_streak_membership
        FOREIGN KEY (membership_id) REFERENCES memberships(membership_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_streak_sport
        FOREIGN KEY (sport_id) REFERENCES sports(sport_id)
        ON DELETE CASCADE,
    CONSTRAINT uq_streak_membership_sport
        UNIQUE (membership_id, sport_id),
    CONSTRAINT chk_current_streak
        CHECK (current_streak >= 0),
    CONSTRAINT chk_longest_streak
        CHECK (longest_streak >= 0)
);

CREATE TABLE gym_tracker. rankings (
    ranking_id INT AUTO_INCREMENT PRIMARY KEY,
    membership_id INT NOT NULL,
    sport_id INT NOT NULL,
    period_type ENUM('weekly', 'monthly', 'all_time') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    rank_position INT NOT NULL,
    ranking_percent DECIMAL(5,2) NOT NULL,
    score DECIMAL(10,2) NOT NULL DEFAULT 0,
    calculated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ranking_membership
        FOREIGN KEY (membership_id) REFERENCES memberships(membership_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ranking_sport
        FOREIGN KEY (sport_id) REFERENCES sports(sport_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_rank_position
        CHECK (rank_position > 0),
    CONSTRAINT chk_ranking_percent
        CHECK (ranking_percent >= 0 AND ranking_percent <= 100),
    CONSTRAINT chk_score
        CHECK (score >= 0)
);

INSERT INTO gym_tracker.users (username, email, password_hash, full_name, phone, gender, date_of_birth, join_date, is_active)
VALUES
('ali_s', 'ali@example.com', 'hashed_pw_1', 'Ali Sbaih', '0591111111', 'male', '2004-05-12', '2026-03-01', TRUE),
('sara_a', 'sara@example.com', 'hashed_pw_2', 'Sara Ahmad', '0592222222', 'female', '2003-09-20', '2026-03-02', TRUE),
('omar_k', 'omar@example.com', 'hashed_pw_3', 'Omar Khaled', '0593333333', 'male', '2002-11-03', '2026-03-03', TRUE);

INSERT INTO gym_tracker.branches (branch_name, city, address, phone, open_time, close_time)
VALUES
('Main Branch', 'Gaza', 'Al Remal Street', '0599000001', '06:00:00', '23:00:00'),
('North Branch', 'Gaza', 'Jabalia Main Road', '0599000002', '06:00:00', '22:00:00');

INSERT INTO gym_tracker.memberships (user_id, branch_id, membership_type, start_date, end_date, status)
VALUES
(1, 1, 'monthly', '2026-03-01', '2026-03-31', 'active'),
(2, 1, 'quarterly', '2026-03-01', '2026-05-31', 'active'),
(3, 2, 'yearly', '2026-01-01', '2026-12-31', 'active');

INSERT INTO gym_tracker.sports (sport_name, category, description)
VALUES
('Cardio', 'Endurance', 'Exercises that improve heart health'),
('Strength Training', 'Muscle Building', 'Exercises for muscle strength'),
('Yoga', 'Flexibility', 'Exercises for flexibility and balance');

INSERT INTO gym_tracker.branch_sports (branch_id, sport_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2);

INSERT INTO gym_tracker.membership_sports (membership_id, sport_id, enrollment_status)
VALUES
(1, 1, 'active'),
(1, 2, 'active'),
(2, 3, 'active'),
(3, 2, 'active');

INSERT INTO gym_tracker.workouts (sport_id, workout_name, difficulty_level, estimated_duration_minutes, description)
VALUES
(1, 'Treadmill 30 Minutes', 'beginner', 30, 'Light cardio on treadmill'),
(1, 'HIIT 20 Minutes', 'advanced', 20, 'High intensity interval training'),
(2, 'Leg Day', 'intermediate', 45, 'Lower body strength workout'),
(2, 'Push Day', 'intermediate', 40, 'Chest, shoulders, triceps'),
(3, 'Morning Yoga Flow', 'beginner', 25, 'Simple yoga routine');

INSERT INTO gym_tracker.workout_logs (membership_id, workout_id, log_date, duration_minutes, calories_burned, notes)
VALUES
(1, 1, '2026-03-15', 30, 250, 'Good session'),
(1, 3, '2026-03-16', 45, 320, 'Leg workout'),
(1, 1, '2026-03-17', 35, 280, 'Cardio again'),
(2, 5, '2026-03-16', 25, 120, 'Yoga session'),
(3, 4, '2026-03-16', 40, 300, 'Push day');

INSERT INTO gym_tracker.streaks (membership_id, sport_id, current_streak, longest_streak, last_activity_date)
VALUES
(1, 1, 2, 4, '2026-03-17'),
(1, 2, 1, 3, '2026-03-16'),
(2, 3, 1, 2, '2026-03-16'),
(3, 2, 1, 5, '2026-03-16');

INSERT INTO gym_tracker.rankings (membership_id, sport_id, period_type, period_start, period_end, rank_position, ranking_percent, score)
VALUES
(1, 1, 'weekly', '2026-03-14', '2026-03-20', 1, 10.00, 95.00),
(1, 2, 'weekly', '2026-03-14', '2026-03-20', 2, 20.00, 80.00),
(2, 3, 'weekly', '2026-03-14', '2026-03-20', 1, 10.00, 88.00),
(3, 2, 'weekly', '2026-03-14', '2026-03-20', 1, 10.00, 90.00);