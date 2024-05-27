CREATE MIGRATION m1skwlxs7sffqu3g6ghbllmlcigde6sw4wg22mnw2arsihxud3owrq
    ONTO m1oio2ezjpr3tdmzi726quqge3n3eb3lexvmb6wnyy5bxhg3phoe2q
{
  ALTER TYPE default::Messages {
      DROP PROPERTY audio_bytes;
  };
};
