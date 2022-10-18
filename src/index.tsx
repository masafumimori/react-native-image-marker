import {
  StyleSheet,
  Image,
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  LayoutChangeEvent,
  StyleProp,
  ImageStyle,
  ImageResizeMode,
  ImageSourcePropType,
  Pressable,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';

const DEFAULT_BUFFER = 15;

type Position = { top: number; left: number };
type MarkerBase = { position: Position; markerNumber: number };

type ImageMarkerProps<T extends MarkerBase> = {
  src: ImageSourcePropType;
  markers: Array<T>;
  selectedMarker: T | T[] | undefined;
  onAddMarker: (position: Position) => void;
  onSelectMarker?: (marker: T) => void;
  markerComponent?: React.FC<MarkerBase>;
  selectedMarkerComponent?: React.FC<{ marker: T | undefined }>;
  bufferLeft?: number;
  bufferTop?: number;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
};

const ImageMarker = <T extends MarkerBase>({
  src,
  markers,
  selectedMarker,
  onAddMarker,
  onSelectMarker,
  markerComponent: MarkerComponent,
  selectedMarkerComponent: SelectedMarkerComponent,
  bufferLeft = DEFAULT_BUFFER,
  bufferTop = DEFAULT_BUFFER,
  resizeMode = 'contain',
  style,
}: ImageMarkerProps<T>) => {
  const [imageLayout, setImageLayout] = useState<
    { width: number; height: number } | undefined
  >();

  const handleImagePress = useCallback(
    ({ nativeEvent }: GestureResponderEvent) => {
      if (!imageLayout) return;

      const touchedX =
        ((nativeEvent.locationX - bufferLeft) / imageLayout.width) * 100;
      const touchedY =
        ((nativeEvent.locationY - bufferTop) / imageLayout.height) * 100;

      onAddMarker({
        top: Number(touchedY.toFixed(2)),
        left: Number(touchedX.toFixed(2)),
      });
    },
    [onAddMarker, bufferLeft, bufferTop, imageLayout]
  );

  const getMarkerPosition = useCallback(
    ({ top, left }: Position) => ({
      top: `${top}%`,
      left: `${left}%`,
    }),
    []
  );

  const onImageLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setImageLayout({ width, height });
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={[styles.imageContainer]} onPress={handleImagePress}>
        <Image
          source={src}
          style={[styles.image, style]}
          onLayout={onImageLayout}
          resizeMode={resizeMode}
        />
      </Pressable>
      {markers.map((marker) => (
        <TouchableOpacity
          key={marker.markerNumber}
          onPress={() => onSelectMarker && onSelectMarker(marker)}
          style={[styles.marker, getMarkerPosition(marker.position)]}
        >
          {MarkerComponent ? (
            <MarkerComponent {...marker} />
          ) : (
            <Text style={styles.markerText}>{marker.markerNumber}</Text>
          )}
        </TouchableOpacity>
      ))}
      {selectedMarker && SelectedMarkerComponent && (
        <>
          {Array.isArray(selectedMarker) ? (
            selectedMarker.map((m) => (
              <SelectedMarkerComponent key={m.position.top} marker={m} />
            ))
          ) : (
            <SelectedMarkerComponent marker={selectedMarker} />
          )}
        </>
      )}
    </View>
  );
};

export default ImageMarker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    position: 'absolute',
  },
  imageContainer: {
    // flex: 0,
    backgroundColor: '#000',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    minHeight: 200,
  },
  marker: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: { color: 'white', fontWeight: 'bold' },
});
