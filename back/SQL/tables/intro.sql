CREATE TABLE intro (
    i_idx INT PRIMARY KEY AUTO_INCREMENT,
    userid VARCHAR(32) NOT NULL,
    content VARCHAR(255) NOT NULL,
    FOREIGN KEY (userid) REFERENCES user (userid)
);