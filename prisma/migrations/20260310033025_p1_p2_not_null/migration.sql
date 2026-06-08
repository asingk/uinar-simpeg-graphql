/*
  Warnings:

  - Made the column `p1` on table `grade_remun` required. This step will fail if there are existing NULL values in that column.
  - Made the column `p2` on table `grade_remun` required. This step will fail if there are existing NULL values in that column.

*/
-- delete values
DELETE FROM "grade_remun" WHERE "grade" = '1';
DELETE FROM "grade_remun" WHERE "grade" = '4';
DELETE FROM "grade_remun" WHERE "grade" = '7c';
DELETE FROM "grade_remun" WHERE "grade" = '9c';
DELETE FROM "grade_remun" WHERE "grade" = '13c';
DELETE FROM "grade_remun" WHERE "grade" = '14a';

-- update values
UPDATE "grade_remun" SET "p1" = 6348000, "p2" = 14812000 WHERE "grade" = '17';
UPDATE "grade_remun" SET "p1" = 5085000, "p2" = 11866000 WHERE "grade" = '16';
UPDATE "grade_remun" SET "p1" = 4495000, "p2" = 10488000 WHERE "grade" = '15a';
UPDATE "grade_remun" SET "p1" = 4345000, "p2" = 10139000 WHERE "grade" = '15b';
UPDATE "grade_remun" SET "p1" = 4156000, "p2" = 9698000 WHERE "grade" = '15c';
UPDATE "grade_remun" SET "p1" = 3342000, "p2" = 7798000 WHERE "grade" = '14b';
UPDATE "grade_remun" SET "p1" = 3017000, "p2" = 7041000 WHERE "grade" = '14c';
UPDATE "grade_remun" SET "p1" = 2564000, "p2" = 5982000 WHERE "grade" = '13a';
UPDATE "grade_remun" SET "p1" = 2482000, "p2" = 5791000 WHERE "grade" = '13b';
UPDATE "grade_remun" SET "p1" = 2113000, "p2" = 4930000 WHERE "grade" = '12a';
UPDATE "grade_remun" SET "p1" = 2061000, "p2" = 4809000 WHERE "grade" = '12b';
UPDATE "grade_remun" SET "p1" = 1903000, "p2" = 4441000 WHERE "grade" = '12c';
UPDATE "grade_remun" SET "p1" = 1663000, "p2" = 3880000 WHERE "grade" = '11a';
UPDATE "grade_remun" SET "p1" = 1627000, "p2" = 3796000 WHERE "grade" = '11b';
UPDATE "grade_remun" SET "p1" = 1591000, "p2" = 3713000 WHERE "grade" = '11c';
UPDATE "grade_remun" SET "p1" = 1495000, "p2" = 3488000 WHERE "grade" = '10a';
UPDATE "grade_remun" SET "p1" = 1393000, "p2" = 3251000 WHERE "grade" = '10b';
UPDATE "grade_remun" SET "p1" = 1243000, "p2" = 2900000 WHERE "grade" = '9a';
UPDATE "grade_remun" SET "p1" = 1238000, "p2" = 2888000 WHERE "grade" = '9b';
UPDATE "grade_remun" SET "p1" = 1160000, "p2" = 2707000 WHERE "grade" = '8';
UPDATE "grade_remun" SET "p1" = 996000, "p2" = 2325000 WHERE "grade" = '7a';
UPDATE "grade_remun" SET "p1" = 986000, "p2" = 2300000 WHERE "grade" = '7b';
UPDATE "grade_remun" SET "p1" = 965000, "p2" = 2253000 WHERE "grade" = '6';
UPDATE "grade_remun" SET "p1" = 797000, "p2" = 1861000 WHERE "grade" = '5';
UPDATE "grade_remun" SET "p1" = 707000, "p2" = 1650000 WHERE "grade" = '3';

-- insert values
INSERT INTO "grade_remun" (id, grade, created_by, updated_by, updated_at, p1, p2)
VALUES (gen_random_uuid(), '8 DS PNS', 'admin', 'admin', now(), 1160000, 2436000);
INSERT INTO "grade_remun" (id, grade, created_by, updated_by, updated_at, p1, p2)
VALUES (gen_random_uuid(), '7a DS PNS', 'admin', 'admin', now(), 996000, 2092000);
INSERT INTO "grade_remun" (id, grade, created_by, updated_by, updated_at, p1, p2)
VALUES (gen_random_uuid(), '7a DS PPPK', 'admin', 'admin', now(), 996000, 1860000);
INSERT INTO "grade_remun" (id, grade, created_by, updated_by, updated_at, p1, p2)
VALUES (gen_random_uuid(), '6 DS PNS', 'admin', 'admin', now(), 965000, 2027000);
INSERT INTO "grade_remun" (id, grade, created_by, updated_by, updated_at, p1, p2)
VALUES (gen_random_uuid(), '6 DS PPPK', 'admin', 'admin', now(), 965000, 1802000);
INSERT INTO "grade_remun" (id, grade, created_by, updated_by, updated_at, p1, p2)
VALUES (gen_random_uuid(), '5 DS PNS', 'admin', 'admin', now(), 797000, 1675000);
INSERT INTO "grade_remun" (id, grade, created_by, updated_by, updated_at, p1, p2)
VALUES (gen_random_uuid(), '5 DS PPPK', 'admin', 'admin', now(), 797000, 1489000);

-- AlterTable
ALTER TABLE "grade_remun" ALTER COLUMN "p1" SET NOT NULL,
ALTER COLUMN "p2" SET NOT NULL;
