CREATE TABLE point (
    userid VARCHAR(32) NOT NULL,
    b_point INT NOT NULL DEFAULT 0,
    r_point INT NOT NULL DEFAULT 0,
    FOREIGN KEY (userid) REFERENCES user (userid)
);