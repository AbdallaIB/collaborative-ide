import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})

// Export the project class to be used as TypeScript type
export class Project {
  @prop({ required: [true, 'Title is required.'] })
  title: string;

  @prop({ default: '' })
  css: string;

  @prop({ default: '' })
  html: string;

  @prop({ default: '' })
  js: string;

  @prop({ required: [true, 'Owner id is required.'] })
  ownerId: string;
}

// Create the project model from the project class
const projectModel = getModelForClass(Project);
projectModel.createIndexes();
export default projectModel;
