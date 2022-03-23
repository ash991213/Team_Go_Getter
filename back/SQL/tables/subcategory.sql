CREATE TABLE subcategory (
    s_idx INT PRIMARY KEY AUTO_INCREMENT,
    m_idx INT NOT NULL,
    name VARCHAR(32) NOT NULL,
    FOREIGN KEY (m_idx) REFERENCES maincategory (m_idx)
);