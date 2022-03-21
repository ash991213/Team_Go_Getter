CREATE TABLE user (
    idx INT AUTO_INCREMENT,
    userid VARCHAR(32) NOT NULL,
    userpw VARCHAR(32) NOT NULL,
    username VARCHAR(32) NOT NULL,
    nickname VARCHAR(32) NOT NULL,
    birthdate TIMESTAMP NOT NULL,
    adress VARCHAR(64) NOT NULL,
    gender CHAR(4) NOT NULL,
    mobile CHAR(32) NOT NULL,
    tel CHAR(32),
    email VARCHAR(64) NOT NULL,
    level INT NOT NULL DEFAULT 3,
    isActive BOOLEAN NOT NULL DEFAULT 1,
    point INT NOT NULL DEFAULT 0,
    PRIMARY KEY (idx, userid),
    INDEX idx_user_userid(userid)
);