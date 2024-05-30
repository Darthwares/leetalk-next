CREATE MIGRATION m1oio2ezjpr3tdmzi726quqge3n3eb3lexvmb6wnyy5bxhg3phoe2q
    ONTO m15segxlglfup5mryyavonnjpn7rosbabuoki2w5dhfgfcpgl5aouq
{
  ALTER TYPE default::Messages {
      CREATE PROPERTY audio_bytes: std::bytes;
  };
};
