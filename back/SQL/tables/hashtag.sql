CREATE TABLE hashtag (
    h_idx INT PRIMARY KEY,
    b_idx INT NOT NULL,
    name VARCHAR(32) NOT NULL,
    FOREIGN KEY (b_idx) REFERENCES board (b_idx)
);