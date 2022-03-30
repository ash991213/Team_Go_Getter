CREATE TABLE board (
    b_idx INT PRIMARY KEY AUTO_INCREMENT,
    s_idx INT,
    userid VARCHAR(32) NOT NULL,
    subject VARCHAR(64) NOT NULL,
    content TEXT,
    date TIMESTAMP NOT NULL,
    hit INT DEFAULT 0,
    isActive BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (userid) REFERENCES user (userid),
    FOREIGN KEY (s_idx) REFERENCES subcategory (s_idx)
);