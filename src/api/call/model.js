import mongoose, { Schema } from 'mongoose'

const callSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  currentStepId: {
    type: Schema.ObjectId,
    ref: 'Step'
    // required: true
  },
  status: {
    type: String,
    enum: ['init', 'traveling', 'withofficer', 'waiting', 'finished'],
    default: 'init'
  }
}, {
  timestamps: true
})

callSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      currentStepId: this.currentStepId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      startLocation: this.startLocation,
      endLocation: this.endLocation
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Call', callSchema)

export const schema = model.schema
export default model
