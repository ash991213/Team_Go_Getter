CREATE TABLE board (
    b_idx INT PRIMARY KEY AUTO_INCREMENT,
    s_idx INT NOT NULL,
    userid VARCHAR(32) NOT NULL,
    subject VARCHAR(64) NOT NULL,
    content TEXT,
    date TIMESTAMP NOT NULL,
    hit INT DEFAULT 0,
    FOREIGN KEY (userid) REFERENCES user (userid),
    FOREIGN KEY (s_idx) REFERENCES subcategory (s_idx)
);