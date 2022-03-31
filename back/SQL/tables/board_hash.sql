CREATE TABLE board_hash (
    h_idx INT NOT NULL,
    b_idx INT NOT NULL,
    FOREIGN KEY (h_idx) REFERENCES hashtag (h_idx),
    FOREIGN KEY (b_idx) REFERENCES board (b_idx)
);