{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    go
    nodejs-18_x
    yarn
  ];
}
