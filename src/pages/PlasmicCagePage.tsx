import React from 'react';
import { PlasmicComponent } from '@plasmicapp/loader-react';
import _ from 'lodash';

const HomePage: React.FC = () => {
  const products = _.times(12, (n) => {
    return {
      title: `Nic Cage ${n + 1}`,
      price: _.random(10, 200),
      image: 'https://www.placecage.com/c/160/160',
    };
  });
  const productCards = _.map(products, (product) => {
    return (
      <PlasmicComponent
        component="ProductCard"
        componentProps={{
          title: product.title,
          price: `$${product.price}.00`,
          image: <img alt={product.title} src={product.image} />,
        }}
      />
    );
  });

  return (
    <PlasmicComponent
      component="Home"
      componentProps={{
        header: {
          props: {
            img: {
              src: 'https://www.placecage.com/c/200/39',
            },
            link: {
              href: 'https://niccage.com/',
            },
          },
        },
        productCarousel: {
          props: {
            collectionName: {
              children: 'Nic Cage Furniture Collection',
            },
            img: {
              src: 'https://www.placecage.com/c/328/600',
            },
          },
        },
        productGrid: {
          props: {
            children: productCards,
          },
        },
      }}
    />
  );
};

export default HomePage;
