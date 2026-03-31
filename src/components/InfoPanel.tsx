import React from 'react';
import Card from './ui/Card';
import { SOURCES } from '../utils/constants';

const InfoPanel: React.FC = () => {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-2">How does this service work?</h2>
      <p className="text-gray-600 mb-4">
        WebChat AI helps you chat with any website by analyzing its content. Just provide a URL, and you can ask questions about the site. It makes understanding web content simple and efficient.
      </p>
      <div>
        <h3 className="font-medium text-gray-800 mb-1">Sources Used:</h3>
        <ul className="list-disc list-inside text-blue-600">
          {SOURCES.map((source, idx) => (
            <li key={idx}>
              <a href="#" className="hover:underline">{source}</a>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default InfoPanel;