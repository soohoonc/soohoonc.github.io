echo "Installing Rustup..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

echo "Installing wasm-pack..."
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y

echo "wasm-pack build..."
wasm-pack build --target web

echo "start next build"
next build