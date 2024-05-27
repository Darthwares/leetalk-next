CREATE MIGRATION m164cxfcyzgz6uri2cx3fl7sykgsbrirj5t7ykez2n6fp7qwanmvda
    ONTO m1skwlxs7sffqu3g6ghbllmlcigde6sw4wg22mnw2arsihxud3owrq
{
  ALTER TYPE default::Messages {
      CREATE PROPERTY audio_url: std::str;
  };
};
