CREATE TABLE likes (
    l_idx INT PRIMARY KEY AUTO_INCREMENT,
    userid VARCHAR(32) NOT NULL,
    b_idx INT,
    r_idx INT,
    like_num INT NOT NULL DEFAULT 0,
    dislike_num INT NOT NULL DEFAULT 0,
    like_check INT NOT NULL DEFAULT 0,
    FOREIGN KEY (userid) REFERENCES user (userid),
    FOREIGN KEY (b_idx) REFERENCES board (b_idx),
    FOREIGN KEY (r_idx) REFERENCES reply (r_idx)
);