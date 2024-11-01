<?php 
// Este script crea un archivo de texto con todo el código de todos los archivos JS, CSS y HTML del directorio para poder mostrarle fácilmente el código del proyecto a una IA.
// Crea el archivo 'codigo_completo.txt'.
// EXCEPCIÓN: Conviene eliminar beats.js por que es extremadamente largo y no aporta mayor información del código.
// Uso:
// php grabCode.php

function grabCodeFromDirectory($directory) {
  $output = "";
  $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));

  foreach ($iterator as $file) {
    if ($file->isFile()) {
      $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
      if (in_array($extension, ['html', 'css', 'js', 'webmanifest'])) {
        $filename = $file->getFilename();
        // EXCEPCIÓN!!
        if($filename=='beats.js') continue;
        echo $file."\n";
        $code = str_replace("\n", "\n  ", file_get_contents($file));
        $output .= "<!-- $filename -->\n";
        $output .= "```\n";
        $output .= "  ".$code . "\n";
        $output .= "```\n\n";
      }
    }
  }

  return $output;
}

// Replace 'path/to/your/app' with the actual path to your app directory
$code = grabCodeFromDirectory('./');

// Write the combined code to a new file
file_put_contents('_codigo_completo.txt', $code);

echo "Código guardado correctamente en 'codigo_completo.txt'";

?>