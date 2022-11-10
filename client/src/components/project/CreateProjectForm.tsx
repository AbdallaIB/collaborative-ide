import { ProjectCreateInput } from '@api/types';
import Button from '@components/shared/button';
import Input from '@components/shared/input';
import { Form, Formik } from 'formik';
import { createProjectSchema } from '../../../../server/src/shared/schemas/project';

interface Props {
  onCreateProject: (values: ProjectCreateInput) => void;
}

const CreateProject = ({ onCreateProject }: Props) => {
  return (
    <Formik initialValues={{ title: '' }} validationSchema={createProjectSchema} onSubmit={(e) => onCreateProject(e)}>
      {({ values, errors, isSubmitting, handleChange, handleBlur, touched }) => (
        <Form className="flex flex-col items-center justify-center w-full gap-6">
          <div className="w-full">
            <Input
              id="title"
              type="text"
              name="Title"
              placeholder="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              errMsg={errors.title}
              touched={touched.title}
              style={{ width: '30vw' }}
            ></Input>
          </div>
          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <Button classes="h-8" text={'Create Project'} disabled={isSubmitting} type="submit" isPrimary></Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateProject;
