DROP TABLE  IF EXISTS public.sudoku_scores;
CREATE TABLE sudoku_scores (
    user_id SERIAL,
    user_name TEXT,
    user_score INT,
    registration_date timestamp without time zone
    );

INSERT INTO sudoku_scores VALUES (0, 'Joe', 28, '2022-05-13 13:13:13');
INSERT INTO sudoku_scores VALUES (1, 'Joe', 29, '2022-05-14 14:14:14');
INSERT INTO sudoku_scores VALUES (2, 'Jane', 31, '2022-05-15 15:05:22');