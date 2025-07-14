--Insert a new row to the account table
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--update the tony stark record in account table to an account_type of 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
--delete the tony stark record from account table
DELETE FROM account
WHERE account_id = 1;
--update the string in inv_description column for 'GM Hummer' record
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--select make and model columns and join them with the classification_name field in the classification table 
--for make and model columns in records with classification_id of 2
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM inventory
    INNER JOIN classification ON classification.classification_id = 2
    AND inventory.classification_id = 2;
--update columns inv_image and inv_thumbnail in inventory table
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');