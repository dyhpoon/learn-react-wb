import PermissionsComponent from '../components/Permissions';
import PleaseSignIn from '../components/PleaseSignIn';

const Permissions = props => (
  <div>
    <PleaseSignIn>
      <p>Permissions</p>
      <PermissionsComponent />
    </PleaseSignIn>
  </div>
)

export default Permissions
