interface PackageMeta {
  addDefault?: boolean;
  defaultVersion: string;
  esModule?: boolean;
  packages: Record<string, string>;
  versionName: string;
}

const toMock: Record<string, PackageMeta> = {
  react: {
    defaultVersion: '18.0.0',
    packages: {
      '18.0.0': 'react',
      '17.0.2': 'react17',
      '16.13.0': 'react16',
    },
    versionName: 'REACT_VERSION',
  },
  ['react-dom']: {
    defaultVersion: '18.0.0',
    packages: {
      '18.0.0': 'react-dom',
      '17.0.2': 'react-dom17',
      '16.13.0': 'react-dom16',
    },
    versionName: 'REACT_VERSION',
  },
  ['react-dom/test-utils']: {
    defaultVersion: '18.0.0',
    packages: {
      '18.0.0': 'react-dom/test-utils',
      '17.0.2': 'react-dom17/test-utils',
      '16.13.0': 'react-dom16/test-utils',
    },
    versionName: 'REACT_VERSION',
  },
  ['@testing-library/react']: {
    defaultVersion: '18.0.0',
    packages: {
      '18.0.0': '@testing-library/react',
      '17.0.2': '@testing-library/react17',
      '16.13.0': '@testing-library/react16',
    },
    versionName: 'REACT_VERSION',
  }
};

Object.entries(toMock).forEach(
  ([packageName, { addDefault = true, defaultVersion, esModule = true, packages, versionName }]) => {
    jest.mock(packageName, () => {
      const version = (process.env[versionName] || defaultVersion) as keyof typeof packages;

      const originalModule = jest.requireActual(packages[version]);

      return {
        __esModule: esModule,
        ...originalModule,
        ...(addDefault ? { default: originalModule } : {}),
      };
    });
  },
);
