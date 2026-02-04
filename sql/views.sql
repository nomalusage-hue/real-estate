-------------
CREATE OR REPLACE VIEW property_stats AS
SELECT
  COUNT(*) FILTER (WHERE published = true AND draft = false)               AS total_properties,

  COUNT(*) FILTER (
    WHERE published = true
      AND draft = false
      AND status @> ARRAY['For Sale']
  ) AS for_sale_count,

  COUNT(*) FILTER (
    WHERE published = true
      AND draft = false
      AND status @> ARRAY['For Rent']
  ) AS for_rent_count,

  COUNT(*) FILTER (
    WHERE published = true
      AND draft = false
      AND status @> ARRAY['Sold']
  ) AS sold_count,

  ROUND(
    AVG(sale_price)
    FILTER (
      WHERE published = true
        AND draft = false
        AND status @> ARRAY['For Sale']
        AND sale_price IS NOT NULL
    )
  ) AS average_sale_price,

  ROUND(
    AVG(rent_price)
    FILTER (
      WHERE published = true
        AND draft = false
        AND status @> ARRAY['For Rent']
        AND rent_price IS NOT NULL
    )
  ) AS average_rent_price
FROM properties;





----------
CREATE OR REPLACE VIEW property_city_counts AS
SELECT
  city,
  COUNT(*) AS count
FROM properties
WHERE published = true
  AND draft = false
  AND city IS NOT NULL
GROUP BY city
ORDER BY count DESC;
