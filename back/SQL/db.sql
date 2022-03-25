CREATE DATABASE teamGoGetter;

USE teamGoGetter;

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

CREATE TABLE maincategory (
    m_idx INT PRIMARY KEY AUTO_INCREMENT,
    m_name VARCHAR(32) NOT NULL
);

CREATE TABLE subcategory (
    s_idx INT PRIMARY KEY AUTO_INCREMENT,
    m_idx INT NOT NULL,
    s_name VARCHAR(32) NOT NULL,
    FOREIGN KEY (m_idx) REFERENCES maincategory (m_idx)
);

CREATE TABLE board (
    b_idx INT PRIMARY KEY AUTO_INCREMENT,
    s_idx INT,
    userid VARCHAR(32) NOT NULL,
    subject VARCHAR(64) NOT NULL,
    content TEXT,
    date TIMESTAMP NOT NULL,
    hit INT DEFAULT 0,
    FOREIGN KEY (userid) REFERENCES user (userid),
    FOREIGN KEY (s_idx) REFERENCES subcategory (s_idx)
);

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

CREATE TABLE intro (
    i_idx INT PRIMARY KEY AUTO_INCREMENT,
    userid VARCHAR(32) NOT NULL,
    content VARCHAR(255) NOT NULL,
    FOREIGN KEY (userid) REFERENCES user (userid)
);

CREATE TABLE likes (
    l_idx INT PRIMARY KEY AUTO_INCREMENT,
    userid VARCHAR(32) NOT NULL,
    b_idx INT NOT NULL,
    r_idx INT NOT NULL,
    like_num INT NOT NULL DEFAULT 0,
    dislike_num INT NOT NULL DEFAULT 0,
    like_check INT NOT NULL DEFAULT 0,
    FOREIGN KEY (userid) REFERENCES user (userid),
    FOREIGN KEY (b_idx) REFERENCES board (b_idx),
    FOREIGN KEY (r_idx) REFERENCES reply (r_idx)
);

CREATE TABLE file (
    f_idx INT PRIMARY KEY AUTO_INCREMENT,
    b_idx INT NOT NULL,
    image VARCHAR(64) NOT NULL,
    FOREIGN KEY (b_idx) REFERENCES board (b_idx)
);

CREATE TABLE hashtag (
    h_idx INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL
);

CREATE TABLE board_hash (
    h_idx INT NOT NULL,
    b_idx INT NOT NULL,
    FOREIGN KEY (h_idx) REFERENCES hashtag (h_idx),
    FOREIGN KEY (b_idx) REFERENCES board (b_idx)
);