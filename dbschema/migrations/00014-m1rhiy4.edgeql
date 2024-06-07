CREATE MIGRATION m1rhiy4t3vi4gyccubu3i2bur35qpw2xcnruunyj3xiaqyaxp7iwaq
    ONTO m164cxfcyzgz6uri2cx3fl7sykgsbrirj5t7ykez2n6fp7qwanmvda
{
  ALTER TYPE default::Conversations {
      CREATE PROPERTY imageURL: std::str;
  };
};
