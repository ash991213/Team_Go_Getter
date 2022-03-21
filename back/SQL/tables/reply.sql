CREATE TABLE reply (
    r_idx INT PRIMARY KEY AUTO_INCREMENT,
    userid VARCHAR(32) NOT NULL,
    b_idx INT NOT NULL,
    content TEXT NOT NULL,
    depth INT NOT NULL DEFAULT 0,
    seq INT NOT NULL,
    groupNum INT NOT NULL,
    date TIMESTAMP NOT NULL,
    FOREIGN KEY (userid) REFERENCES user (userid)
);