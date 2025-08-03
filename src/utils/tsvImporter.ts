/*
This is a one-time utility for migrating from my previous spreadsheet-based tracking.
As the name indicates, it reads from TSV, but the columns must be in the following
order for it to work correctly:
    
    date odo trip gal pricePerGal notes mpg cpm cost

In addition, I used computed values (Trip MPG, $/mi, Cost [tank], & Sanity [trip miles])
to verify the entries' emergent values were aligned with the migrated record.
*/

