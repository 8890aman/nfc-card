import BaseTemplate from './BaseTemplate';

const ProfessionalTemplate = (props) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <BaseTemplate {...props}>
        <div className="bg-white text-blue-800 p-4 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-2">Professional Summary</h3>
          <p>Add your professional summary or mission statement here.</p>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default ProfessionalTemplate;