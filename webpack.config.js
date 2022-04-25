/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    alephium: './dist/lib/index.js'
  },
  plugins: [new webpack.SourceMapDevToolPlugin({ filename: '[file].map' })],
  resolve: {
    extensions: ['.js'],
    fallback: {
      fs: false,
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify')
    }
  },
  output: {
    filename: 'alephium.min.js',
    library: {
      name: 'alephium',
      type: 'umd'
    }
  },
  optimization: {
    minimize: true
  }
}