CREATE TABLE file (
    f_idx INT PRIMARY KEY,
    b_idx INT NOT NULL,
    image VARCHAR(64) NOT NULL,
    FOREIGN KEY (b_idx) REFERENCES board (b_idx)
);