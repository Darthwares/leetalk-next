CREATE MIGRATION m1blw4y6zrqfdiodwuiux2yiofcggkgymswzpfivpwrhrc7vwkekvq
    ONTO m1rhiy4t3vi4gyccubu3i2bur35qpw2xcnruunyj3xiaqyaxp7iwaq
{
  ALTER TYPE default::Conversations {
      CREATE PROPERTY viewCount: std::int32;
  };
};
