import * as React from 'react';

import { SafeAreaView, StyleSheet, View } from 'react-native';
import ImageMarker from 'react-native-image-marker';

type MarkerBase = {
  position: { top: number; left: number };
  markerNumber: number;
};
export default function App() {
  const [markers, setMarkers] = React.useState<MarkerBase[]>([
    { markerNumber: 1, position: { top: 32, left: 20 } },
  ]);

  const onAddMarker = (position: { top: number; left: number }) => {
    setMarkers((prev) => [
      ...prev,
      { markerNumber: prev.length + 1, position },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <ImageMarker
          src={require('../assets/sample-image.jpeg')}
          markers={markers}
          onAddMarker={onAddMarker}
          selectedMarker={undefined}
        />
      </View>
      <View style={styles.box} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
  },
});
