attrib -R %WINDIR%\\System32\\drivers\\etc\\hosts
cacls %WINDIR%\\System32\\drivers\\etc\\hosts /e /p %username%:f