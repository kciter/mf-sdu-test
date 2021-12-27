import React, { useMemo, useState } from 'react';

function loadComponent(scope: string, module: string) {
  return async () => {
    await __webpack_init_sharing__('default');
    const container = window[scope as any];
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const useDynamicScript = (args: any) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement('script');

    element.src = args.url;
    element.type = 'text/javascript';
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

function System(props: any) {
  const { ready, failed } = useDynamicScript({
    url: props.system && props.system.url,
  });

  if (!props.system) {
    return <>Need system</>;
  }

  if (!ready) {
    return <>Loading</>;
  }

  if (failed) {
    return <>Failed</>;
  }

  const Component = React.lazy(loadComponent(props.system.scope, props.system.module));

  return (
    <React.Suspense fallback="Loading System">
      <Component {...props}>{props.children}</Component>
    </React.Suspense>
  );
}

interface RemoteComponentMeta {
  app: string;
  component: string;
  remote: string;
  props?: { [key: string]: any };
  children?: string | RemoteComponentMeta[];
}

const makeRemoteComponentTree = (tree: RemoteComponentMeta[], data?: { [key: string]: any }) => {
  return tree.map((node) => {
    return (
      <System key={node.component} system={{ url: node.remote, scope: node.app, module: `./${node.component}` }} {...node.props}>
        {Array.isArray(node.children)
          ? makeRemoteComponentTree(node.children, data)
          : node.children && data && data[node.children]
          ? data[node.children]
          : node.children}
      </System>
    );
  });
};

const IndexDesktop = () => {
  const defaultTree = [
    {
      app: 'app2',
      component: 'Text',
      remote: 'http://localhost:3002/web/remoteEntry.js',
      props: {
        block: true,
        size: 100,
        color: 'red',
      },
      children: 'test',
    },
    {
      app: 'app2',
      component: 'Text',
      remote: 'http://localhost:3002/web/remoteEntry.js',
      props: {
        block: true,
        size: 50,
        color: 'blue',
      },
      children: '텍스트 테스트',
    },
    {
      app: 'app4',
      component: 'Image',
      remote: 'http://localhost:3004/remoteEntry.js',
      props: {
        size: 300,
        src: 'https://picsum.photos/200?1',
      },
      children: undefined,
    },
    {
      app: 'app4',
      component: 'Div',
      remote: 'http://localhost:3004/remoteEntry.js',
      props: {},
      children: [
        {
          app: 'app4',
          component: 'Div',
          remote: 'http://localhost:3004/remoteEntry.js',
          props: {
            style: { display: 'inline-block', marginRight: 50 },
          },
          children: [
            {
              app: 'app4',
              component: 'Image',
              remote: 'http://localhost:3004/remoteEntry.js',
              props: {
                size: 100,
                src: 'https://picsum.photos/200?12',
              },
              children: undefined,
            },
          ],
        },
        {
          app: 'app4',
          component: 'Div',
          remote: 'http://localhost:3004/remoteEntry.js',
          props: {
            style: { display: 'inline-block', marginRight: 100 },
          },
          children: [
            {
              app: 'app2',
              component: 'Text',
              remote: 'http://localhost:3002/web/remoteEntry.js',
              props: {
                block: true,
                size: 50,
                color: '#888fff',
              },
              children: '텍스트 테스트',
            },
          ],
        },
        {
          app: 'app4',
          component: 'Div',
          remote: 'http://localhost:3004/remoteEntry.js',
          props: {
            style: { display: 'inline-block' },
          },
          children: [
            {
              app: 'app2',
              component: 'Text',
              remote: 'http://localhost:3002/web/remoteEntry.js',
              props: {
                block: true,
                size: 50,
                color: '#888fff',
              },
              children: 'show.title',
            },
          ],
        },
      ],
    },
  ];

  const [treeData, setTreeData] = useState(JSON.stringify(defaultTree));
  const data = {
    'show.title': 'im title',
  };

  const tree = useMemo(() => {
    try {
      return JSON.parse(treeData);
    } catch {
      return [];
    }
  }, [treeData]);

  return (
    <div>
      <textarea
        defaultValue={JSON.stringify(tree, null, 2)}
        onInput={(e: React.KeyboardEvent<HTMLTextAreaElement>) => setTreeData(e.currentTarget.value)}
        style={{ width: 500, height: 800 }}
      />

      <div style={{ display: 'inline-block' }}>{makeRemoteComponentTree(tree, data)}</div>
    </div>
  );
};

export default IndexDesktop;
